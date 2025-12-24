export default function SidebarNavigation ({icon , title}) {
    return (
        <div className="sidebar-container-row">
            <span className="icon">
                <img src={icon} alt={title} />
            </span>
            <span>
                <h4 className="default-text-color">{title}</h4>
            </span>
        </div>
    )
}