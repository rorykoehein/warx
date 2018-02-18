import React from 'react';
import styles from './styles';
import { transparentize } from 'polished';

export default class WorldSprite extends React.PureComponent {
    static defaultProps = {
        ratio: 2,
    };

    render() {
        const { ratio } = this.props;
        const style = {
            position: 'absolute',
            width: `calc((100vh - 4vw) * ${ratio})`,
            height: `calc((100vw - 4vw) * ${1/ratio})`,
            maxHeight: 'calc(100vh - 4vw)',
            maxWidth: 'calc(100vw - 4vw)',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            boxSizing: 'content-box',
            border: `1px solid ${transparentize(.7, styles.colorTertiary)}`,
            overflow: 'hidden',
        };

        return (
            <div style={style}>
                {this.props.children}
            </div>
        )
    }
}
