import './Button.css';

Button.defaultProps = {
    caption: 'button',
    title: '',
    className: '',
    onClick: () => console.error('Button hasn\'t "onClick" callback')
}

export default function Button({title, className, caption, onClick}) {
    return (
        <div className={`messenger-button ${className}`}
             title={title || caption}
             onClick={onClick}>
            {caption}
        </div>
    );
}