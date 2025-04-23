import React from 'react';
import parse, { domToReact } from 'html-react-parser';
import Link from './link';
import _ from 'lodash';

const convertChildren = (children, index) => domToReact(children, { key: index });

export default function htmlToReact(html) {
    if (!html) {
        return null;
    }

    return parse(html, {
        replace: (node, index) => {
            if (node.type === 'script') {
                const { src, ...rest } = node.attribs || {};
                
                // Handle external scripts
                if (src) {
                    return <script key={index} src={src} {...rest} />;
                }

                // Handle inline scripts
                const scriptContent = node.children?.[0]?.data || '';
                return (
                    <script
                        key={index}
                        dangerouslySetInnerHTML={{ __html: scriptContent }}
                        {...rest}
                    />
                );
            } else if (node.type === 'tag' && node.name === 'a') {
                const href = node.attribs.href;
                const props = _.omit(node.attribs, 'href');
                return (
                    <Link key={index} href={href} {...props}>
                        {convertChildren(node.children, index)}
                    </Link>
                );
            }
        }
    });
}
