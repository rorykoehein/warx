import React from 'react';
import styles from './styles';

export default class WorldSprite extends React.PureComponent {
    static defaultProps = {
        ratio: 2,
    };

    render() {
        const { ratio } = this.props;
        const style = {
            position: 'absolute',
            width: `calc((100vh - 1vw) * ${ratio})`,
            height: `calc((100vw - 1vw) * ${1/ratio})`,
            maxHeight: 'calc(100vh - 1vw)',
            maxWidth: 'calc(100vw - 1vw)',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            boxSizing: 'content-box',
            border: `.1rem solid ${styles.colorTertiary}`,
            overflow: 'hidden',
            background: styles.colorPrimary
        };

        return (
            <div style={style}>
                {this.props.children}
            </div>
        )
    }
}
