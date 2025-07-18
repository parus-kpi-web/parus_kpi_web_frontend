import React from 'react';
import { ReflexContainer, ReflexElement, ReflexSplitter } from 'react-reflex';
import 'react-reflex/styles.css';

interface MultiSplitPaneProps {
    children: React.ReactNode[];
    orientation?: 'horizontal' | 'vertical';
    defaultSizes?: number[];
}

const MultiSplitPane: React.FC<MultiSplitPaneProps> = ({
                                                           children,
                                                           orientation = 'horizontal',
                                                           defaultSizes = [],
                                                       }) => (
    <ReflexContainer orientation={orientation} style={{ height: '100%' }}>
        {children.map((child, idx) => (
            <React.Fragment key={idx}>
                <ReflexElement flex={defaultSizes[idx] ?? 100 / children.length}>
                    {child}
                </ReflexElement>
                {idx < children.length - 1 && <ReflexSplitter />}
            </React.Fragment>
        ))}
    </ReflexContainer>
);

export default MultiSplitPane;