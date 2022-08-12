'use strict';

window.linqs = window.linqs || {};
window.linqs.pubs = window.linqs.pubs || {};

window.linqs.pubs.KEY_PAPERS = [
    {
        'id': 'bach-jmlr17',
        'description': 'The caconical PSL reference.',
    },
    {
        'id': 'srinivasan-mlj21',
        'description': 'An extensive look into the different weight learning approaches available in PSL.',
    },
    {
        'id': 'pryor-arxiv22',
        'description': 'The first neural symbolic method to integrate PSL reasoning with neural computation.',
    },
];

window.linqs.pubs.REQUIRED_TAG = 'psl';

window.linqs.pubs.KEY_SECTION = {'section': 'Key PSL Publications', 'anchor': 'key', 'tags': []};
window.linqs.pubs.SECTIONS = [
    {'section': 'Theory & Systems', 'anchor': 'ts', 'tags': ['theory', 'systems']},
    {'section': 'Applications', 'anchor': 'applications', 'tags': ['application']},
];

window.linqs.pubs.constructPubs = function(papers) {
    let html = '';

    papers.sort(function(a, b) {
        return a.title.localeCompare(b.title);
    });

    papers.forEach(function(paper) {
        html += `
            <div class='pubs-paper'>
                <a class='pubs-paper-title' href='${window.linqs.pubs.linqswebsite}/publications/#id:${paper.id}'>
                    ${paper.title}
                </a>.
                <span>${paper.authors.join(', ')}</span>.
                <span>${paper.venue}</span>
                <span>${paper.year}</span>.
            </div>
        `;
    });

    return html;
};

window.linqs.pubs.constructPubSection = function(sectionInfo) {
    let html = `
        <h2 id='${sectionInfo.anchor}'>${sectionInfo.section}</h2>
    `;

    let papers = [];

    for (let paperID in window.linqs.pubs.pubs) {
        let paper = window.linqs.pubs.pubs[paperID];

        if (!paper.keywords || !paper.keywords.includes(window.linqs.pubs.REQUIRED_TAG)) {
            continue;
        }

        let commonTags = paper.keywords.filter(tag => sectionInfo.tags.includes(tag));
        if (commonTags.length == 0) {
            continue;
        }

        paper.id = paperID;
        papers.push(paper);
    }

    html += window.linqs.pubs.constructPubs(papers);

    return html;
};

window.linqs.pubs.constructKeyPubs = function() {
    let html = `
        <h2 id='${window.linqs.pubs.KEY_SECTION.anchor}'>${window.linqs.pubs.KEY_SECTION.section}</h2>
    `;

    window.linqs.pubs.KEY_PAPERS.forEach(function(paperReference) {
        let paper = window.linqs.pubs.pubs[paperReference.id];
        if (!paper) {
            console.error(`Could not find key paper: '${paperReference.id}'.`);
            return;
        }

        html += `
            <div class='pubs-paper pubs-key-paper'>
                <a class='pubs-paper-title' href='${window.linqs.pubs.linqswebsite}/publications/#id:${paperReference.id}'>
                    ${paper.title}
                </a>
                <p class='pubs-paper-description'>${paperReference.description}</p>
            </div>
        `;
    });

    return html;
};

window.linqs.pubs.renderPubs = function() {
    let html = `
        <p>
            Below are select publications using PSL.
            For a more complete list of PSL publications,
            see the <a href='${window.linqs.pubs.linqswebsite}/publications'>LINQS lab's publications page</a>.
        </p>
        <span>Quick Links:</span>
        <ul>
            <li><a href='#${window.linqs.pubs.KEY_SECTION.anchor}'>${window.linqs.pubs.KEY_SECTION.section}</a></li>
    `;

    window.linqs.pubs.SECTIONS.forEach(function(section) {
        html += `
            <li><a href='#${section.anchor}'>${section.section}</a></li>
        `;
    });

    html += `
        </ul>
        <hr />
    `;

    html += window.linqs.pubs.constructKeyPubs();

    window.linqs.pubs.SECTIONS.forEach(function(section) {
        html += window.linqs.pubs.constructPubSection(section);
    });

    document.querySelector('.pubs-area').innerHTML = html;
};

document.addEventListener("DOMContentLoaded", function(event) {
    window.linqs.pubs.renderPubs();
});
