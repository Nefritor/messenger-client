import './Button.css';

Button.defaultProps = {
    caption: 'button',
    title: '',
    className: '',
    style: {},
    onClick: () => console.error('Button hasn\'t "onClick" callback')
}

export default function Button({title, className, caption, children, style, onClick}) {
    return (
        <div className={`messenger-button ${className}`}
             style={style}
             title={title || caption}
             onClick={onClick}>
            {children || caption}
        </div>
    );
}