document.addEventListener("DOMContentLoaded", () => {

    const table = document.getElementById("usersTable");
    const form = document.getElementById("addUserForm");
    const toggleBtn = document.getElementById("toggleAddUser");
    const container = document.getElementById("addUserContainer");

    // =======================
    // Toggle Add User
    // =======================

    toggleBtn.addEventListener("click", () => {

        if (container.style.display === "none") {

            container.style.display = "block";
            toggleBtn.textContent = "- Hide";

        } else {

            container.style.display = "none";
            toggleBtn.textContent = "+ Add User";

        }

    });


    // =======================
    // Load Users
    // =======================

    async function loadUsers() {

        const res = await fetch("/api/users", {
            credentials: "include"
        });

        const result = await res.json();
        const users = result.data || [];

        table.innerHTML = "";

        users.forEach(u => {

            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${u.user_id}</td>
                <td>${u.username}</td>
                <td>${u.role}</td>
                <td>${u.is_active ? "Active" : "Inactive"}</td>

                <td>

                        ${u.role === "Owner"
                        ? "Owner Protected"
                        : `
                        <button onclick="changeUsername(${u.user_id})">Username</button>
                        <button onclick="resetPassword(${u.user_id})">Password</button>
                        <button onclick="changeRole(${u.user_id})">Role</button>
                        <button onclick="toggleStatus(${u.user_id})">Status</button>
                        `
                        }
                </td>
            `;

            table.appendChild(row);

        });

    }


    // =======================
    // Create User
    // =======================

    form.addEventListener("submit", async (e) => {

        e.preventDefault();

        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;
        const role = document.getElementById("role").value;

        const res = await fetch("/api/users", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            credentials: "include",

            body: JSON.stringify({
                username,
                password,
                role
            })

        });

        const result = await res.json();

        if (!res.ok) {

            alert(result.message);
            return;

        }

        alert("User created");

        form.reset();
        loadUsers();

    });


    // =======================
    // Change Username
    // =======================

    window.changeUsername = async function (id) {

        const username = prompt("Enter new username");

        if (!username) return;

        const res = await fetch(`/api/users/${id}/username`, {

            method: "PATCH",

            headers: {
                "Content-Type": "application/json"
            },

            credentials: "include",

            body: JSON.stringify({ username })

        });

        const result = await res.json();

        if (!res.ok) {

            alert(result.message);
            return;

        }

        alert("Username updated");

        loadUsers();

    };


    // =======================
    // Reset Password
    // =======================

    window.resetPassword = async function (id) {

        const password = prompt("Enter new password");

        if (!password) return;

        const res = await fetch(`/api/users/${id}/password`, {

            method: "PATCH",

            headers: {
                "Content-Type": "application/json"
            },

            credentials: "include",

            body: JSON.stringify({ password })

        });

        const result = await res.json();

        if (!res.ok) {

            alert(result.message);
            return;

        }

        alert("Password reset");

    };


    // =======================
    // Change Role
    // =======================

    window.changeRole = async function (id) {

        const role = prompt("Enter role (Owner/Pharmacist/Staff)");

        if (!role) return;

        const res = await fetch(`/api/users/${id}/role`, {

            method: "PATCH",

            headers: {
                "Content-Type": "application/json"
            },

            credentials: "include",

            body: JSON.stringify({ role })

        });

        const result = await res.json();

        if (!res.ok) {

            alert(result.message);
            return;

        }

        alert("Role updated");

        loadUsers();

    };


    // =======================
    // Toggle Status
    // =======================

    window.toggleStatus = async function (id) {

        const res = await fetch(`/api/users/${id}/status`, {

            method: "PATCH",

            credentials: "include"

        });

        const result = await res.json();

        if (!res.ok) {

            alert(result.message);
            return;

        }

        loadUsers();

    };


    // =======================

    loadUsers();

});