import { Command } from 'commander';
import { program } from 'commander';

// Import command modules
import { helpCommand } from './commands/help';
import { versionCommand } from './commands/version';
// TODO: import other commands as they are implemented

// Help command (default)
program
  .name('ludo')
  .description('Ludoforge CLI - Create complete video games from scratch with AI agents')
  .version('0.0.0-inicial', '-v, --version', 'output the current version')
  .option('-c, --cwd <path>', 'specify the working directory')
  .option('--json', 'output in JSON format')
  .option('--quiet', 'only output errors')
  .option('--verbose', 'output verbose logs')
  .helpOption('-h, --help', 'display help for command');

// Version command (already covered by .version above, but we can have an explicit one if needed)
// We'll keep the .version and also add a explicit version command for completeness
program
  .command('version')
  .alias('v')
  .description('output the current version')
  .action(() => {
    console.log('0.0.0-inicial');
  });

// Help command (explicit)
program
  .command('help')
  .alias('h')
  .description('display help for command')
  .action(() => {
    program.help();
  });

// Default command (when no command is provided) - show help
program.on('command:*', function ([command]) {
  if (command === undefined) {
    program.help();
  }
});

// Parse arguments
program.parse(process.argv);

// If no command was provided, show help (already handled by the above listener, but just in case)
if (!program.args.length && !program.commands.length) {
  program.help();
}

export default program;
