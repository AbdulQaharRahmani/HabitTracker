import profilePic from '../assets/profile-pic5.svg'

export default function UserProfile () {
    return (
        <div className='my-container'>
            <div className="profile-pic">
                <img src={profilePic} alt="user-profile-picture" className='pic'/>
            </div>
            <div className='info-container'>
                <h4 className='default-text-color'>User Name</h4>
                <a href="#">View Profile</a>
            </div>
        </div>
    )       
}