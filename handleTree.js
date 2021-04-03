const dirTree = require("directory-tree");
const fs = require('fs');
const replace = require('replace-in-file');

const tree = dirTree('./brands/', { extensions: /\.(md|html)$/ });

let hadleIcons = function (type) {
    return type === 'directory' ? ':file_folder:' : ':page_facing_up:'
}
//console.log(tree);
//return

var content = '';
for (let files in tree) {

    //console.log(files)

    if (typeof tree[files] !== 'object') {

    } else {
        tree[files].map(m => { // dir first level

            if (m.type === 'directory') {

                content += `* **${m.name}** \n`

                //console.log(m.children)
                m.children.map(m2 => { // dir second level
                    content += `   * [${m2.name}](${encodeURI(m2.path)}) ${hadleIcons(m2.type)} \n`
                    console.log(m2)

                    if (m2.type === 'directory') {
                        m2.children.map(m3 => { // dir thirty level
                            content += `      * [${m3.name}](${encodeURI(m3.path)}) ${hadleIcons(m3.type)} \n`

                            if (m3.type === 'directory') {
                                m3.children.map(m4 => { // dir fourth level
                                    content += `         * [${m4.name}](${encodeURI(m4.path)}) ${hadleIcons(m4.type)} \n`
                                })
                            }
                        })
                    }
                })
            }
        })
    }

    // if (typeof tree[path] === 'object') {
    //     //console.log(tree[path])
    //     tree[path].map(m => {
    //         //console.log('-- ', m.name)
    //     })
    // } else {
    //     console.log('- ', tree[path])
    // }
}

fs.writeFile('./clients.html', content, err => {
    if (err) {
        console.error(err)
        return
    }
    //file written successfully
})

const options = {
    files: './README.md',
    from: /--Marcas--([\s\S]*?)--Fim Marcas--/gm,
    to: `--Marcas-- \n ${content} \n --Fim Marcas--`,
};

try {
    const results = replace(options)
    console.log('Replacement results:', results);
}
catch (error) {
    console.error('Error occurred:', error);
}

  // ^(?:(?!\# Marcas).)*