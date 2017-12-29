module.exports = function (plop) {

    const paths = {
        client: 'client/src/state',
        server: 'server/state',
    };

    plop.setGenerator('module', {
        description: 'server module',
        prompts: [{
            type: 'list',
            name: 'where',
            message: "Client of server:",
            default: "client",
            choices: [
                { name: "client", value: "client" },
                { name: "server", value: "server" }
            ]
        },
            {
            type: 'input',
            name: 'name',
            message: 'Module name:'
        }],
        actions: ({ name, where }) => [{
            type: 'add',
            path: `${paths[where]}/module-${name}.js`,
            templateFile: 'plop-templates/module.hbs'
        }]
    });

    plop.setHelper('equal', (a, b, opts) => {
        if(a === b)
            return opts.fn(this);
        else
            return opts.inverse(this);
    });
};