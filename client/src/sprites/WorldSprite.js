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
            width: `calc((100vh - 3vw) * ${ratio})`,
            height: `calc((100vw - 3vw) * ${1/ratio})`,
            maxHeight: 'calc(100vh - 3vw)',
            maxWidth: 'calc(100vw - 3vw)',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            boxSizing: 'content-box',
            border: `.1rem solid ${styles.colorTertiary}`,
            overflow: 'hidden',
            boxShadow: '0px 0px 0px .5vw rgba(56, 201, 255, 0.2)',
            background: transparentize(0.5, styles.colorPrimary),
        };

        return (
            <div style={style}>
                {this.props.children}
            </div>
        )
    }
}
