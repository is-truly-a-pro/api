const fs = require('fs');
const path = require('path');

const domainsDir = './domains';
const outputFilePath = './index.json';

function combineJSONFiles() {
    const combinedData = [];

    fs.readdir(domainsDir, (err, files) => {
        if (err) {
            console.error(`Error reading domains directory: ${err}`);
            return;
        }

        files.forEach(file => {
            const filePath = path.join(domainsDir, file);

            if (path.extname(file) === '.json') {
                const domainName = path.basename(file, '.json') + '.is-truly-a.pro';

                try {
                    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

                    const ownerInfo = data.owner;
                    const recordInfo = data.record || {};
                    const entry = {
                        domain: domainName,
                        owner: {
                            username: ownerInfo.username || null,
                            email: Array.isArray(ownerInfo.email) ? ownerInfo.email : ownerInfo.email ? [ownerInfo.email] : null,
                            discord: ownerInfo.discord || null
                        },
                        record: recordInfo,
                        proxied: false
                    };

                    Object.keys(entry.owner).forEach(key => {
                        if (!entry.owner[key]) {
                            delete entry.owner[key];
                        }
                    });

                    combinedData.push(entry);
                } catch (e) {
                    console.error(`Error parsing JSON file ${file}: ${e}`);
                }
            }
        });

        fs.writeFileSync(outputFilePath, JSON.stringify(combinedData, null, 2), 'utf8');
        console.log(`Combined JSON created at ${outputFilePath}`);
    });
}

combineJSONFiles();
