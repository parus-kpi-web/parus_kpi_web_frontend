import React from 'react';
import {ReflexContainer, ReflexSplitter, ReflexElement} from 'react-reflex';
import 'react-reflex/styles.css';

export interface SplitPaneLayoutProps {
    panes: React.ReactNode[];
    orientation?: 'vertical' | 'horizontal';
}

const SplitPaneLayout: React.FC<SplitPaneLayoutProps> = ({
                                                             panes,
                                                             orientation = 'horizontal',
                                                         }) => {
    const children: React.ReactNode[] = [];
    panes.forEach((pane, idx) => {
        children.push(
            <ReflexElement key={`pane-${idx}`} flex={1} propagateDimensions>
                {pane}
            </ReflexElement>
        );
        if (idx < panes.length - 1) {
            children.push(
                <ReflexSplitter key={`splitter-${idx}`} propagate/>
            );
        }
    });
    return (
        <ReflexContainer orientation={orientation} style={{height: '100%', width: '100%'}}>
            {children}
        </ReflexContainer>
    );
};

export default SplitPaneLayout;