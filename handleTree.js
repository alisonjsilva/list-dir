const dirTree = require("directory-tree");
const fs = require('fs');
const replace = require('replace-in-file');
const path = require('path');
const { error } = require("console");

const tree = dirTree('./brands/', { extensions: /\.(md|html)$/, exclude: /(img|js)$/ });

let hadleIcons = function (type) {
    return ''
    return type === 'directory' ? ':file_folder:' : ':page_facing_up:'
}

let isAdFolder = function (name) {
    if (/[0-9]+x[0-9]+/.test(name)) {
        return true
    }
    return false
}

let addFile = function (treeNode) {
    if (!isAdFolder(treeNode.name)) {
        const dirPath = path.join(__dirname, treeNode.path, 'index_.html');
        console.log(dirPath, 'dir')

        try {
            if (fs.existsSync(path)) {
                //file exists
            } else {
                fs.copyFile(path.join(__dirname, '_templates_', '_index_.html'), dirPath, (error) => {
                    if (error) {
                        console.error(error)
                    } else {
                        console.log('file copied')
                    }
                })
            }
        } catch (err) {
            console.error(err)
        }
        // fs.appendFile(dirPath, '<h1>File</h1>', function (err) {
        //     if (err) throw err;
        //     console.log('File created!');
        // });
    }
}

let replaceHtml = function () {
    let options = {
        files: './README.md',
        from: /<!-- start replace -->([\s\S]*?)<!-- end start replace -->/gm,
        to: `<!-- start replace --> \n ${content} \n <!-- end start replace -->`,
    };
    
    try {
        let results = replace(options)
        console.log('Replacement results:', results);
    }
    catch (error) {
        console.error('Error occurred:', error);
    }
}

var content = '';

const pathLength = (path) => (path.match(/\//g) || 1).length

const mdFolderTitle = ({path, name, type}) => {
    let space = '   '.repeat(pathLength(path))
    content += `${space}* [${name}](${encodeURI(path)}) ${type}\n`
    console.log(content)
}

const liFolderTitle = ({}) => {

}

let diveInDirObj = (tree) => {
    
    if (tree.type === 'directory') {
        
        if(pathLength(tree.path) === 1)
            content += `* **${tree.name}** \n`

        let node = [tree]
        mdFolderTitle(...node)
        tree.children.map(t => {
            
            //console.log('---dir---', tree.path, pathLength(tree.path) )
            
            if (tree.type === 'directory') {
                diveInDirObj(t)
            }
            
        })
    }
}
//console.log(tree);
//return

/*
<ul> --level 1
    <li> --level 1
        dsdsfsdf
        <ul> --level 2
            <li> --level 2
                12121
                <ul></ul> --level 3
            </li>
        </ul>
    </li>
</ul>

*/


var contentHtml = ''
for (let nodes in tree) {

    //console.log(files)

    if (typeof tree[nodes] !== 'object') {

    } else {
        tree[nodes].map(m => { // dir first level
            diveInDirObj(m)
            return
            if (m.type === 'directory') {
                let secondLevelLi = ``
                addFile(m)

                content += `* **${m.name}** \n`
                
                //console.log(m.children)
                m.children.map(m2 => { // dir second level
                    content += `   * [${m2.name}](${encodeURI(m2.path)}) ${hadleIcons(m2.type)} \n`
                    secondLevelLi += `<li>${m2.name}</li>`
                    //console.log(m2)

                    if (m2.type === 'directory') {

                        addFile(m2)

                        m2.children.map(m3 => { // dir thirty level
                            content += `      * [${m3.name}](${encodeURI(m3.path)}) ${hadleIcons(m3.type)} \n`

                            if (m3.type === 'directory') {

                                addFile(m3)

                                m3.children.map(m4 => { // dir fourth level
                                    content += `         * [${m4.name}](${encodeURI(m4.path)}) ${hadleIcons(m4.type)} \n`

                                    if (m4.type === 'directory') {

                                        addFile(m4)

                                        m4.children.map(m5 => { // dir fifth level
                                            content += `            * [${m5.name}](${encodeURI(m5.path)}) ${hadleIcons(m4.type)} \n`
                                        })
                                    }

                                })
                            }
                        })
                    }
                })
                secondLevelLi += `<ul>${secondLevelLi}</ul>`
                //console.log(secondLevelLi)
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
    to: `--Marcas--\n${content}\n--Fim Marcas--`,
};

try {
    const results = replace(options)
    console.log('Replacement results:', results);
}
catch (error) {
    console.error('Error occurred:', error);
}

  // ^(?:(?!\# Marcas).)*