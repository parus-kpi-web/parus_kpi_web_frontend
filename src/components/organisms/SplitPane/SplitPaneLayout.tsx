import React from 'react';
import { ReflexContainer, ReflexSplitter, ReflexElement } from 'react-reflex';
import 'react-reflex/styles.css';

export interface SplitPaneLayoutProps {
    left: React.ReactNode;
    right: React.ReactNode;
    orientation?: 'vertical' | 'horizontal';
}

const SplitPaneLayout: React.FC<SplitPaneLayoutProps> = ({
                                                             left,
                                                             right,
                                                             orientation = 'horizontal',
                                                         }) => (
    <ReflexContainer orientation={orientation}>
        <ReflexElement>{left}</ReflexElement>
        <ReflexSplitter />
        <ReflexElement>{right}</ReflexElement>
    </ReflexContainer>
);

export default SplitPaneLayout;