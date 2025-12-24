import SidebarNavigation from "./SidebarNavigation-Com2";
import UserProfile from "./UserProfile-Com1";
import profilePic from '../assets/profile-pic5.svg'
// import icon1 from './assets/calendar-today.svg'


import icon1 from '../assets/calendar-today.svg'
import icon2 from '../assets/habit-pic.svg'
import icon3 from '../assets/tasks-pic.svg'
import icon4 from '../assets/statics-pic.svg'
import icon5 from '../assets/settings-pic.svg'

export default function Sidebar () {
    return (
        <div className="sidebar-wrapper">
            <div className="sidebar-container">
                <UserProfile></UserProfile>
                <nav className="menu">
                    <SidebarNavigation icon={icon1} title='Today'></SidebarNavigation>
                    <span className="selected">
                        <SidebarNavigation icon={icon2} title='Habits'></SidebarNavigation>

                    </span>
                    <SidebarNavigation icon={icon3} title='Tasks'></SidebarNavigation>
                    <SidebarNavigation icon={icon4} title='Statics'></SidebarNavigation>
                    <SidebarNavigation icon={icon5} title='Settings'></SidebarNavigation>
                </nav>
            </div>
        </div>
    )
}