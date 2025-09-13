import type {PropsWithChildren} from 'react';

export default function ThemeProvider({ children }: PropsWithChildren) {
    // сюда позже добавим темы/переключатель
    return <>{children}</>;
}
