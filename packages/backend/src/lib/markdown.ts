import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import remarkGfm from 'remark-gfm';
import remarkDirective from 'remark-directive';
import rehypeRaw from 'rehype-raw';
import remarkSmartypants from 'remark-smartypants';
import { visit } from 'unist-util-visit';
import rehypeSanitize, { defaultSchema, type Options } from 'rehype-sanitize';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

let processorPromise: Promise<any> | null = null;

async function getProcessor() {
    if (processorPromise) return processorPromise;

    processorPromise = (async () => {
        const { default: rehypeShiki } = await import('@shikijs/rehype');
        const schema: Options = {
            ...defaultSchema,
            attributes: {
                ...defaultSchema.attributes,
                '*': ['className'],
                div: [...(defaultSchema.attributes?.div || []), 'style', ['data*']],
                span: [...(defaultSchema.attributes?.span || []), 'className', 'style'],
                pre: ['className', 'style'],
                code: ['className', 'style']
            },
            tagNames: [
                ...(defaultSchema.tagNames || []),
                'div',
                'span',
                'i',
                'iframe',
                'video',
                'audio',
                'img',
                'math',
                'mi',
                'mo',
                'mn',
                'msup',
                'msub',
                'mfrac',
                'mtable',
                'mtr',
                'mtd'
            ]
        };

        function remarkCustomContainers() {
            return (tree: any) => {
                visit(tree, node => {
                    if (node.type === 'containerDirective') {
                        const data = node.data || (node.data = {});
                        const attributes = node.attributes || {};
                        const name = node.name;

                        if (name === 'align') {
                            const align =
                                attributes.class || Object.keys(attributes)[0] || 'center';
                            data.hName = 'div';
                            data.hProperties = { className: [`md-align-${align}`] };
                        } else if (name === 'epigraph') {
                            const author = attributes.author || '';
                            data.hName = 'div';
                            data.hProperties = {
                                className: ['md-epigraph'],
                                'data-author': author
                            };
                        } else if (['info', 'warning', 'success', 'error'].includes(name)) {
                            const title = attributes.title || name.toUpperCase();
                            const open = attributes.open !== undefined;
                            data.hName = 'div';
                            data.hProperties = {
                                className: ['md-block', name],
                                'data-title': title,
                                'data-open': open.toString()
                            };
                        }
                    }
                });
            };
        }

        function rehypeCustomContainers() {
            return (tree: any) => {
                visit(tree, 'element', (node: any) => {
                    if (node.properties && node.properties.className) {
                        const classes = node.properties.className;

                        if (classes.includes('md-epigraph')) {
                            const author = node.properties['data-author'] || '';
                            delete node.properties['data-author'];
                            const body = {
                                type: 'element',
                                tagName: 'div',
                                properties: { className: ['epigraph-body'] },
                                children: node.children
                            };
                            const children = [body];
                            if (author) {
                                children.push({
                                    type: 'element',
                                    tagName: 'span',
                                    properties: { className: ['epigraph-author'] },
                                    children: [{ type: 'text', value: author }]
                                });
                            }
                            node.children = children;
                        }

                        const typeClass = classes.find((c: string) =>
                            ['info', 'warning', 'success', 'error'].includes(c)
                        );
                        if (typeClass && classes.includes('md-block')) {
                            const title = node.properties['dataTitle'] || typeClass.toUpperCase();
                            const open = node.properties['dataOpen'] === 'true';
                            delete node.properties['dataTitle'];
                            delete node.properties['dataOpen'];

                            const titleNode = {
                                type: 'element',
                                tagName: 'div',
                                properties: { className: ['md-block-title'] },
                                children: [
                                    {
                                        type: 'element',
                                        tagName: 'span',
                                        children: [{ type: 'text', value: title }]
                                    },
                                    {
                                        type: 'element',
                                        tagName: 'i',
                                        properties: {
                                            className: [
                                                'toggle-btn',
                                                'fa',
                                                `fa-caret-${open ? 'down' : 'right'}`
                                            ]
                                        },
                                        children: []
                                    }
                                ]
                            };
                            const bodyNode = {
                                type: 'element',
                                tagName: 'div',
                                properties: {
                                    className: ['md-block-body'],
                                    style: open ? '' : 'display:none'
                                },
                                children: node.children
                            };
                            node.children = [titleNode, bodyNode];
                        }
                    }
                });
            };
        }

        return unified()
            .use(remarkParse)
            .use(remarkGfm)
            .use(remarkMath)
            .use(remarkSmartypants)
            .use(remarkDirective)
            .use(remarkCustomContainers)
            .use(remarkRehype, { allowDangerousHtml: true })
            .use(rehypeRaw)
            .use(rehypeSanitize, schema)
            .use(rehypeCustomContainers)
            .use(rehypeKatex)
            .use(rehypeShiki, {
                themes: { light: 'github-light', dark: 'github-light' },
                langs: [
                    'javascript',
                    'typescript',
                    'python',
                    'java',
                    'c',
                    'cpp',
                    'go',
                    'rust',
                    'bash',
                    'json',
                    'yaml',
                    'markdown',
                    'vue',
                    'html',
                    'css'
                ],
                defaultColor: false
            })
            .use(rehypeStringify);
    })();

    return processorPromise;
}

export default async function renderMarkdown(src: string) {
    if (!src) return '';

    const processor = await getProcessor();

    const pattern = /^(:{2,})\s*([\w|-]+)(\s*\[.*?])?(\s*\{.*?})?\s*$/;
    function preprocessLine(line: string) {
        const match = line.match(pattern);
        if (match) {
            const word = match[2];
            const bracket = match[3] || '';
            const brace = match[4] || '';
            let attributes = '';
            if (bracket) {
                const content = bracket.trim().slice(1, -1);
                if (['info', 'warning', 'success', 'error'].includes(word))
                    attributes += `title="${content}" `;
                else if (word === 'epigraph') attributes += `author="${content}" `;
            }
            if (brace) attributes += brace.trim().slice(1, -1);
            return `:::${word}{${attributes.trim()}}`;
        }
        return line;
    }

    const preprocessed = src.split(/\r?\n/).map(preprocessLine).join('\n');

    try {
        const file = await processor.process(preprocessed);
        return replaceUI(String(file));
    } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Render Error';
        return `<p>渲染失败：${msg}</p>`;
    }
}

function replaceUI(s: string) {
    return s
        .split('<table>')
        .join('<div class="table-container"><table>')
        .split('</table>')
        .join('</table></div>');
}
