import './Button.css';

Button.defaultProps = {
    caption: 'button',
    title: 'button',
    className: '',
    onClick: () => console.error('Button hasn\'t "onClick" callback')
}

export default function Button(props) {
    return (
        <div className={`messenger-button ${props.className}`}
             title={props.title || props.caption}
             onClick={() => props.onClick()}>
            {props.caption}
        </div>
    );
}