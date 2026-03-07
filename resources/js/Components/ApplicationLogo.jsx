export default function ApplicationLogo({ className = '', ...props }) {
    return (
        <img
            src="/logo.png"
            className={`object-contain ${className}`}
            alt="Mytrix IT Logo"
            {...props}
        />
    );
}
