import React, { useEffect, useState } from "react";
import "../CSS/Profile.css";
import API from "../utils/api";
function Profile() {
  const [myprofile, setMyProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState({
    fullname: false,
    age: false,
    coverImage: false,
  });

  // For "Add Additional Information" (create profile)
  const [addMode, setAddMode] = useState(false);
  const [addForm, setAddForm] = useState({
    age: "",
    coverImage: "",
    sociallinks: { github: "", linkedin: "" },
  });

  const getMyProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${API}/api/profile/personalinfo`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );
      if (response.ok) {
        const data = await response.json();
        setMyProfile(data);
      } else {
        console.error("Failed to fetch profile");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMyProfile();
  }, []);

  // Save a single edited field (fullname | age | coverImage)
  const handleEditedSave = async (field) => {
    // build body with only changed field(s)
    let body = {};
    if (field === "fullname") {
      body.fullname = myprofile?.user?.fullname || "";
    } else if (field === "age") {
      // ensure age is number or null
      const ageVal = myprofile?.profile?.age;
      body.age = ageVal === "" || ageVal === null ? null : Number(ageVal);
    } else if (field === "coverImage") {
      body.coverImage = myprofile?.profile?.coverImage || "";
    } else {
      console.error("Unknown field to save:", field);
      return;
    }

    try {
      const response = await fetch(
        `${API}/api/profile/personalinfo`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(body),
        }
      );

      if (response.ok) {
        const updated = await response.json();
        // backend returns { user, profile } (matching controllers we discussed)
        setMyProfile(updated);
        alert(`${field} updated`);
        setEditMode((prev) => ({ ...prev, [field]: false }));
      } else {
        const errText = await response.text();
        console.error("Update failed:", errText);
        alert("Update failed");
      }
    } catch (error) {
      console.error(error);
      alert("Update error");
    }
  };

  // Create profile (POST) when there's no profile yet
  const handleAddProfile = async () => {
    // basic validation
    if (addForm.age === "" && addForm.coverImage === "" && !addForm.sociallinks.github && !addForm.sociallinks.linkedin) {
      alert("Please add at least one field.");
      return;
    }

    const payload = {
      age: addForm.age === "" ? undefined : Number(addForm.age),
      coverImage: addForm.coverImage || undefined,
      sociallinks: {
        github: addForm.sociallinks.github || undefined,
        linkedin: addForm.sociallinks.linkedin || undefined,
      },
    };

    // strip undefined values
    const cleaned = JSON.parse(JSON.stringify(payload));

    try {
      const response = await fetch(
       `${API}/api/profile/personalinfo`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(cleaned),
        }
      );

      if (response.ok) {
        const created = await response.json();
        // If your backend returns created profile only, we need to re-fetch user info
        // but assuming backend returns { user, profile } (like previous code), set it directly:
        // If backend returns only profile, you may want to call getMyProfile() instead.
        // Here we try to merge safely:
        if (created.user && created.profile) {
          setMyProfile(created);
        } else {
          // fallback: re-fetch the whole thing
          await getMyProfile();
        }
        setAddMode(false);
        alert("Profile created");
      } else {
        const txt = await response.text();
        console.error("Create failed:", txt);
        alert("Create failed");
      }
    } catch (error) {
      console.error(error);
      alert("Create error");
    }
  };

  if (loading) return <p>Loading profile...</p>;

  return (
    <>
      {!myprofile ? (
        <p>Unable to load profile data.</p>
      ) : (
        <div className="profile-container">
          <div className="profile-section">
            <h2>Personal Information</h2>
            <div className="input-group">
              <div className="user-edit">
                <label htmlFor="fullname">Full Name</label>
                {editMode.fullname ? (
                  <span
                    className="edit-link"
                    onClick={() => handleEditedSave("fullname")}
                  >
                    Save
                  </span>
                ) : (
                  <span
                    className="edit-link"
                    onClick={() =>
                      setEditMode((prev) => ({ ...prev, fullname: true }))
                    }
                  >
                    Edit
                  </span>
                )}
              </div>

              <input
                type="text"
                id="fullname"
                value={myprofile?.user?.fullname || ""}
                readOnly={!editMode.fullname}
                onChange={(e) =>
                  setMyProfile((prev) => ({
                    ...prev,
                    user: { ...prev.user, fullname: e.target.value },
                  }))
                }
              />

              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                value={myprofile?.user?.username || ""}
                readOnly
              />
            </div>
          </div>

          <div className="profile-section">
            <h3>Email Address</h3>
            <input type="email" value={myprofile?.user?.email || ""} readOnly />
          </div>

          <div className="profile-section">
            <h3>Mobile Number</h3>
            <input
              type="text"
              value={myprofile?.user?.mobile || ""}
              readOnly
            />
          </div>

          {/* Additional info */}
          {!myprofile.profile ? (
            <>
              {!addMode ? (
                <button className="prof-btn" onClick={() => setAddMode(true)}>
                  Add Additional Information
                </button>
              ) : (
                <div className="profile-section add-section">
                  <h3>Add Additional Information</h3>

                  <label>Age</label>
                  <input
                    type="number"
                    value={addForm.age}
                    onChange={(e) =>
                      setAddForm((prev) => ({ ...prev, age: e.target.value }))
                    }
                  />

                  <label>Cover Image URL</label>
                  <input
                    type="text"
                    value={addForm.coverImage}
                    onChange={(e) =>
                      setAddForm((prev) => ({ ...prev, coverImage: e.target.value }))
                    }
                  />

                  <label>Github URL</label>
                  <input
                    type="text"
                    value={addForm.sociallinks.github}
                    onChange={(e) =>
                      setAddForm((prev) => ({
                        ...prev,
                        sociallinks: { ...prev.sociallinks, github: e.target.value },
                      }))
                    }/>

                  <label>LinkedIn URL</label>
                  <input
                    type="text"
                    value={addForm.sociallinks.linkedin}
                    onChange={(e) =>
                      setAddForm((prev) => ({
                        ...prev,
                        sociallinks: { ...prev.sociallinks, linkedin: e.target.value },
                      }))
                    }
                  />

                  <div style={{ marginTop: 8 }}>
                    <button className="prof-btn"  onClick={handleAddProfile}>Save</button>{" "}
                    <button className="prof-btn"  onClick={() => setAddMode(false)}>Cancel</button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="profile-section">
                <h3>
                  Age{" "}
                  {editMode.age ? (
                    <span className="edit-link" onClick={() => handleEditedSave("age")}>
                      Save
                    </span>
                  ) : (
                    <span className="edit-link" onClick={() => setEditMode((p) => ({ ...p, age: true }))}>
                      Edit
                    </span>
                  )}
                </h3>
                <input
                  type="number"
                  value={myprofile?.profile?.age ?? ""}
                  readOnly={!editMode.age}
                  onChange={(e) =>
                    setMyProfile((prev) => ({
                      ...prev,
                      profile: { ...prev.profile, age: e.target.value },
                    }))
                  }
                />
              </div>

              <div className="profile-section">
                <h3>
                  Cover Image{" "}
                  {editMode.coverImage ? (
                    <span className="edit-link" onClick={() => handleEditedSave("coverImage")}>
                      Save
                    </span>
                  ) : (
                    <span className="edit-link" onClick={() => setEditMode((p) => ({ ...p, coverImage: true }))}>
                      Edit
                    </span>
                  )}
                </h3>

                {editMode.coverImage ? (
                  <input
                    type="text"
                    value={myprofile?.profile?.coverImage || ""}
                    onChange={(e) =>
                      setMyProfile((prev) => ({
                        ...prev,
                        profile: { ...prev.profile, coverImage: e.target.value },
                      }))
                    }
                  />
                ) : (
                  myprofile?.profile?.coverImage ? (
                    <img
                      src={myprofile.profile.coverImage}
                      alt="cover"
                      style={{ maxWidth: "100%", height: "auto" }}
                    />
                  ) : (
                    <p>No cover image</p>
                  )
                )}
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}

export default Profile;
