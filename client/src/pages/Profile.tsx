import { useState } from "react";
import { User, Mail, Phone, Lock, Save, Edit2 } from "lucide-react";

const Profile = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [profile, setProfile] = useState({
        name: "Sarah Johnson",
        email: "sarah.johnson@lighthouseleaders.nz",
        phone: "+64 21 123 4567",
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const handleSave = () => {
        setIsEditing(false);
    };

    const handleChange = (field: string, value: string) => {
        setProfile({ ...profile, [field]: value });
    };

    const handlePasswordChange = () => {
        alert("Password change functionality would be implemented here");
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    };

    return (
        <div className="profile-page">
            <div className="profile-inner">
                <h1 className="profile-heading">Profile Settings</h1>

                {/* Contact Information */}
                <div className="profile-card">
                    <div className="profile-card-header">
                        <h3 className="profile-card-title">
                            <span className="profile-card-accent" />
                            Contact Information
                        </h3>
                        {!isEditing ? (
                            <button onClick={() => setIsEditing(true)} className="profile-btn-primary">
                                <Edit2 className="profile-btn-icon" />
                                Edit
                            </button>
                        ) : (
                            <div className="profile-btn-group">
                                <button onClick={() => setIsEditing(false)} className="profile-btn-outline">
                                    Cancel
                                </button>
                                <button onClick={handleSave} className="profile-btn-primary">
                                    <Save className="profile-btn-icon" />
                                    Save
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="profile-fields">
                        <div className="profile-field">
                            <label className="profile-label">
                                <User className="profile-label-icon" />
                                Full Name
                            </label>
                            {!isEditing ? (
                                <p className="profile-field-value">{profile.name}</p>
                            ) : (
                                <input
                                    type="text"
                                    value={profile.name}
                                    onChange={(e) => handleChange("name", e.target.value)}
                                    className="profile-input"
                                />
                            )}
                        </div>

                        <div className="profile-field">
                            <label className="profile-label">
                                <Mail className="profile-label-icon" />
                                Email Address
                            </label>
                            {!isEditing ? (
                                <p className="profile-field-value">{profile.email}</p>
                            ) : (
                                <input
                                    type="email"
                                    value={profile.email}
                                    onChange={(e) => handleChange("email", e.target.value)}
                                    className="profile-input"
                                />
                            )}
                        </div>

                        <div className="profile-field">
                            <label className="profile-label">
                                <Phone className="profile-label-icon" />
                                Phone Number
                            </label>
                            {!isEditing ? (
                                <p className="profile-field-value">{profile.phone}</p>
                            ) : (
                                <input
                                    type="tel"
                                    value={profile.phone}
                                    onChange={(e) => handleChange("phone", e.target.value)}
                                    className="profile-input"
                                />
                            )}
                        </div>
                    </div>
                </div>

                {/* Account Management */}
                <div className="profile-card">
                    <div className="profile-card-header">
                        <h3 className="profile-card-title">
                            <span className="profile-card-accent" />
                            Account Management
                        </h3>
                    </div>

                    <div className="profile-fields">
                        <div className="profile-field">
                            <label className="profile-label">
                                <Lock className="profile-label-icon" />
                                Current Password
                            </label>
                            <input
                                type="password"
                                value={passwordData.currentPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                placeholder="Enter current password"
                                className="profile-input"
                            />
                        </div>

                        <div className="profile-field">
                            <label className="profile-label">
                                <Lock className="profile-label-icon" />
                                New Password
                            </label>
                            <input
                                type="password"
                                value={passwordData.newPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                placeholder="Enter new password"
                                className="profile-input"
                            />
                        </div>

                        <div className="profile-field">
                            <label className="profile-label">
                                <Lock className="profile-label-icon" />
                                Confirm New Password
                            </label>
                            <input
                                type="password"
                                value={passwordData.confirmPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                placeholder="Confirm new password"
                                className="profile-input"
                            />
                        </div>

                        <button onClick={handlePasswordChange} className="profile-btn-submit">
                            Update Password
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;