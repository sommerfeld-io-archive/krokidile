module.exports = {
    extends: ['@commitlint/config-conventional'],
    rules: {
        'type-enum': [2, 'always', ['build', 'ci', 'docs', 'feat', 'fix', 'perf', 'refactor', 'test']],
        'subject-full-stop': [0, 'never'],
        'subject-case': [0, 'never']
    }
};
