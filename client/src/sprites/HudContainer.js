import React from 'react';

const style = {
    opacity: '1',
};

export default class X extends React.PureComponent {
    render() {
        return <div style={style}>{this.props.children}</div>
    }
}
