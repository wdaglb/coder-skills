#!/usr/bin/env node

"use strict";

const fs = require("node:fs/promises");
const path = require("node:path");
const os = require("node:os");
const readline = require("node:readline/promises");
const process = require("node:process");

/**
 * CLI 入口仅负责分发当前项目支持的少量命令。
 * 这里保持最小实现，避免为了“可扩展”过早引入命令框架。
 */
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (!command || command === "help" || command === "--help" || command === "-h") {
    printHelp();
    return;
  }

  if (command === "install") {
    const options = parseInstallOptions(args.slice(1));
    await installSkills(options);
    return;
  }

  throw new Error(`Unknown command: ${command}`);
}

/**
 * 输出帮助信息，明确告知推荐的调用方式和参数语义。
 */
function printHelp() {
  console.log(`coder-skills

Usage:
  pnpm coder-skills install [--target codex|claude|all] [--force]
  pnpm exec coder-skills install [--target codex|claude|all] [--force]

Commands:
  install    Create symlinks for AGENTS.md and project skills.

Options:
  --target   Install target. Supports codex, claude, all. Default: all
  --force    Replace existing targets without prompting

Environment:
  CODEX_HOME   Override Codex home directory (default: ~/.codex)
  CLAUDE_HOME  Override Claude Code home directory (default: ~/.claude)
`);
}

/**
 * 解析 install 命令参数。
 *
 * @param {string[]} args install 子命令后的参数列表
 * @returns {{ targets: string[], force: boolean }}
 */
function parseInstallOptions(args) {
  const options = {
    targets: ["codex", "claude"],
    force: false,
  };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];

    if (arg === "--force") {
      options.force = true;
      continue;
    }

    if (arg === "--target") {
      const rawValue = args[index + 1];

      if (!rawValue) {
        throw new Error("Missing value for --target");
      }

      options.targets = normalizeTargets(rawValue);
      index += 1;
      continue;
    }

    if (arg.startsWith("--target=")) {
      options.targets = normalizeTargets(arg.slice("--target=".length));
      continue;
    }

    throw new Error(`Unknown option: ${arg}`);
  }

  return options;
}

/**
 * 允许用户通过逗号分隔一次安装多个目标，同时保留 all 这个便捷别名。
 *
 * @param {string} rawValue 原始 target 参数
 * @returns {string[]}
 */
function normalizeTargets(rawValue) {
  const requestedTargets = rawValue
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);

  if (requestedTargets.length === 0) {
    throw new Error("At least one target must be provided to --target");
  }

  if (requestedTargets.includes("all")) {
    return ["codex", "claude"];
  }

  const allowedTargets = new Set(["codex", "claude"]);

  for (const target of requestedTargets) {
    if (!allowedTargets.has(target)) {
      throw new Error(`Unsupported target: ${target}`);
    }
  }

  return [...new Set(requestedTargets)];
}

/**
 * 执行安装流程：先解析源目录，再按目标平台分别创建 AGENTS/AGENT 与 skills 的软链接。
 *
 * @param {{ targets: string[], force: boolean }} options install 选项
 * @returns {Promise<void>}
 */
async function installSkills(options) {
  const repoRoot = path.resolve(__dirname, "..");
  const sourceAgentsFile = path.join(repoRoot, "AGENTS.md");
  const sourceSkillsDir = path.join(repoRoot, "skills");
  const targets = buildTargets();
  const skillEntries = await getSkillEntries(sourceSkillsDir);

  await ensureReadablePath(sourceAgentsFile, "Source AGENTS.md was not found");
  await ensureReadablePath(sourceSkillsDir, "Source skills directory was not found");

  const prompt = createPrompt(options.force);
  let skippedCount = 0;
  let linkedCount = 0;

  try {
    for (const targetName of options.targets) {
      const targetConfig = targets[targetName];

      if (!targetConfig) {
        throw new Error(`Missing target config: ${targetName}`);
      }

      console.log(`\n[${targetConfig.label}]`);

      await fs.mkdir(path.dirname(targetConfig.agentsPath), { recursive: true });
      await fs.mkdir(targetConfig.skillsPath, { recursive: true });

      const agentsResult = await ensureSymlink({
        sourcePath: sourceAgentsFile,
        destinationPath: targetConfig.agentsPath,
        force: options.force,
        prompt,
        label: `${targetConfig.label} ${path.basename(targetConfig.agentsPath)}`,
      });

      linkedCount += agentsResult.linked ? 1 : 0;
      skippedCount += agentsResult.skipped ? 1 : 0;

      for (const skillEntry of skillEntries) {
        const destinationPath = path.join(targetConfig.skillsPath, skillEntry.name);
        const skillResult = await ensureSymlink({
          sourcePath: skillEntry.path,
          destinationPath,
          force: options.force,
          prompt,
          label: `${targetConfig.label} skill/${skillEntry.name}`,
        });

        linkedCount += skillResult.linked ? 1 : 0;
        skippedCount += skillResult.skipped ? 1 : 0;
      }
    }
  } finally {
    await prompt.close();
  }

  console.log("\nDone.");
  console.log(`- Linked: ${linkedCount}`);
  console.log(`- Skipped: ${skippedCount}`);
}

/**
 * 为不同客户端提供明确的目标路径。
 * Claude Code 当前本机目录表现为 AGENT.md，因此这里映射单数文件名。
 *
 * @returns {{ codex: { label: string, agentsPath: string, skillsPath: string }, claude: { label: string, agentsPath: string, skillsPath: string } }}
 */
function buildTargets() {
  const codexHome = process.env.CODEX_HOME || path.join(os.homedir(), ".codex");
  const claudeHome = process.env.CLAUDE_HOME || path.join(os.homedir(), ".claude");

  return {
    codex: {
      label: "Codex",
      agentsPath: path.join(codexHome, "AGENTS.md"),
      skillsPath: path.join(codexHome, "skills"),
    },
    claude: {
      label: "Claude Code",
      agentsPath: path.join(claudeHome, "AGENT.md"),
      skillsPath: path.join(claudeHome, "skills"),
    },
  };
}

/**
 * 获取项目内所有 skill 目录。
 * 只对直接子目录建链，避免把目标端整个 skills 目录整体替换掉。
 *
 * @param {string} sourceSkillsDir 项目 skills 根目录
 * @returns {Promise<Array<{ name: string, path: string }>>}
 */
async function getSkillEntries(sourceSkillsDir) {
  const dirents = await fs.readdir(sourceSkillsDir, { withFileTypes: true });

  return dirents
    .filter((entry) => entry.isDirectory())
    .map((entry) => ({
      name: entry.name,
      path: path.join(sourceSkillsDir, entry.name),
    }))
    .sort((left, right) => left.name.localeCompare(right.name));
}

/**
 * 对单个目标创建软链接。
 * 若目标已存在，则在非 force 模式下逐项询问，避免误覆盖用户已有配置。
 *
 * @param {{
 *   sourcePath: string,
 *   destinationPath: string,
 *   force: boolean,
 *   prompt: { confirm: (message: string) => Promise<boolean>, close: () => Promise<void> },
 *   label: string
 * }} params 链接参数
 * @returns {Promise<{ linked: boolean, skipped: boolean }>}
 */
async function ensureSymlink(params) {
  const { sourcePath, destinationPath, force, prompt, label } = params;
  const existingEntry = await readExistingEntry(destinationPath);

  if (existingEntry && (await pointsToSameSource(existingEntry, destinationPath, sourcePath))) {
    console.log(`- Skip ${label}: already linked`);
    return { linked: false, skipped: true };
  }

  if (existingEntry) {
    const shouldReplace =
      force ||
      (await prompt.confirm(
        `${label} already exists at ${destinationPath}. Replace it? [y/N] `,
      ));

    if (!shouldReplace) {
      console.log(`- Skip ${label}: kept existing target`);
      return { linked: false, skipped: true };
    }

    // 只有在用户确认后才删除现有目标，避免无提示覆盖用户自己的配置。
    await fs.rm(destinationPath, { recursive: true, force: true });
  }

  const sourceStats = await fs.lstat(sourcePath);
  const linkType = sourceStats.isDirectory() && process.platform === "win32" ? "junction" : "dir";

  await fs.symlink(sourcePath, destinationPath, sourceStats.isDirectory() ? linkType : "file");
  console.log(`- Linked ${label} -> ${sourcePath}`);

  return { linked: true, skipped: false };
}

/**
 * 读取目标路径的现状。不存在时返回 null，便于调用方按“需创建”处理。
 *
 * @param {string} targetPath 目标路径
 * @returns {Promise<import("node:fs").Stats | null>}
 */
async function readExistingEntry(targetPath) {
  try {
    return await fs.lstat(targetPath);
  } catch (error) {
    if (error && error.code === "ENOENT") {
      return null;
    }

    throw error;
  }
}

/**
 * 判断已有软链接是否已经指向当前项目源路径。
 * 这样可以避免重复删除重建，减少对用户本地环境的扰动。
 *
 * @param {import("node:fs").Stats} existingEntry 现有目标的 lstat 结果
 * @param {string} destinationPath 当前目标路径
 * @param {string} expectedSourcePath 期望的源路径
 * @returns {Promise<boolean>}
 */
async function pointsToSameSource(existingEntry, destinationPath, expectedSourcePath) {
  if (!existingEntry.isSymbolicLink()) {
    return false;
  }

  try {
    const actualTarget = await fs.readlink(destinationPath);
    const actualResolvedPath = path.resolve(path.dirname(destinationPath), actualTarget);
    const expectedResolvedPath = path.resolve(expectedSourcePath);
    return actualResolvedPath === expectedResolvedPath;
  } catch {
    return false;
  }
}

/**
 * 创建交互确认器。非 TTY 环境下如果发生覆盖冲突，会明确失败而不是静默跳过或误删。
 *
 * @param {boolean} force 是否已启用强制覆盖
 * @returns {{ confirm: (message: string) => Promise<boolean>, close: () => Promise<void> }}
 */
function createPrompt(force) {
  if (force) {
    return {
      confirm: async () => true,
      close: async () => {},
    };
  }

  if (!process.stdin.isTTY || !process.stdout.isTTY) {
    return {
      confirm: async (message) => {
        throw new Error(`${message}Cannot prompt in a non-interactive terminal. Re-run with --force if replacement is intended.`);
      },
      close: async () => {},
    };
  }

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return {
    confirm: async (message) => {
      const answer = await rl.question(message);
      return ["y", "yes"].includes(answer.trim().toLowerCase());
    },
    close: async () => {
      rl.close();
    },
  };
}

/**
 * 在开始安装前尽早校验源路径是否存在，避免安装到一半才暴露源目录缺失。
 *
 * @param {string} targetPath 需要校验的路径
 * @param {string} errorMessage 失败时抛出的错误信息
 * @returns {Promise<void>}
 */
async function ensureReadablePath(targetPath, errorMessage) {
  try {
    await fs.access(targetPath);
  } catch (error) {
    if (error && error.code === "ENOENT") {
      throw new Error(errorMessage);
    }

    throw error;
  }
}

main().catch((error) => {
  console.error(`Error: ${error.message}`);
  process.exitCode = 1;
});
