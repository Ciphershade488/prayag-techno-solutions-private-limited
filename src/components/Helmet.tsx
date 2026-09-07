import React, { useEffect } from 'react';

export interface HelmetProps {
  children?: React.ReactNode;
}

export const Helmet: React.FC<HelmetProps> = ({ children }) => {
  useEffect(() => {
    React.Children.forEach(children, (child) => {
      if (!React.isValidElement(child)) return;
      const element = child as React.ReactElement<{ children?: React.ReactNode; name?: string; property?: string; content?: string }>;
      if (element.type === 'title') {
        const titleText = element.props.children;
        if (typeof titleText === 'string') {
          document.title = titleText;
        } else if (Array.isArray(titleText)) {
          document.title = titleText.join('');
        }
      } else if (element.type === 'meta') {
        const { name, property, content } = element.props;
        if ((name || property) && content) {
          const selector = name ? `meta[name="${name}"]` : `meta[property="${property}"]`;
          let meta = document.querySelector(selector);
          if (!meta) {
            meta = document.createElement('meta');
            if (name) meta.setAttribute('name', name);
            if (property) meta.setAttribute('property', property);
            document.head.appendChild(meta);
          }
          meta.setAttribute('content', content);
        }
      }
    });
  }, [children]);

  return null;
};

export default Helmet;
