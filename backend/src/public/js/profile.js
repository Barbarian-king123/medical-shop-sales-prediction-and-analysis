
document.addEventListener("DOMContentLoaded", async () => {

  try {

    const res = await fetch("/api/profile/me", {
      credentials: "include"
    });

    const result = await res.json();

    const user = result.data;

    document.getElementById("username").textContent = user.username;

    document.getElementById("role").textContent = user.role;

    document.getElementById("status").textContent =
      user.is_active ? "Active" : "Inactive";

  } catch (err) {

    console.error("Profile load error:", err);

  }

});
document.addEventListener("DOMContentLoaded", () => {

const passwordForm = document.getElementById("passwordForm");
const usernameForm = document.getElementById("usernameForm");

// ==========================
// Change Password
// ==========================

passwordForm.addEventListener("submit", async (e) => {

  e.preventDefault();

  const current_password =
  document.getElementById("current_password").value;

  const new_password =
  document.getElementById("new_password").value;

  const res = await fetch("/api/profile/change-password",{

    method:"PATCH",

    headers:{
      "Content-Type":"application/json"
    },

    credentials:"include",

    body:JSON.stringify({
      current_password,
      new_password
    })

  });

  const result = await res.json();

  if(!res.ok){
    alert(result.message);
    return;
  }

  alert("Password updated successfully");

  passwordForm.reset();

});


// ==========================
// Change Username (Owner)
// ==========================

if(usernameForm){

usernameForm.addEventListener("submit", async (e) => {

  e.preventDefault();

  const new_username =
  document.getElementById("new_username").value;

  const res = await fetch("/api/profile/change-username",{

    method:"PATCH",

    headers:{
      "Content-Type":"application/json"
    },

    credentials:"include",

    body:JSON.stringify({
      new_username
    })

  });

  const result = await res.json();

  if(!res.ok){
    alert(result.message);
    return;
  }

  alert("Username updated");

  document.getElementById("username").textContent = new_username;

});

}

});