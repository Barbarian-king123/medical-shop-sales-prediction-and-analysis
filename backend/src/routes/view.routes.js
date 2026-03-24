const express = require("express");
const router = express.Router();
const authService = require("../modules/auth/auth.service");
const dashboardService = require("../modules/dashboard/dashboard.service");
const { verifyViewToken } = require("../middlewares/viewAuth.middleware");


// =====================
// Dashboard
// =====================
router.get("/dashboard", verifyViewToken, async (req, res) => {
  try {
    const dashboardData = await dashboardService.getDashboardData(req.user);

    res.render("dashboard", {
      user: req.user,
      dashboard: dashboardData,
      activePage: "dashboard"
    });

  } catch (err) {
    console.error(err);
    res.status(500).send("Dashboard error");
  }
});


// =====================
// Signup
// =====================
router.get("/signup", (req, res) => {
  res.render("signup");
});

router.post("/signup", async (req, res) => {
  try {
    await authService.register(req.body);
    res.redirect("/login?success=Registered successfully");
  } catch (err) {
    res.redirect(`/signup?error=${encodeURIComponent(err.message)}`);
  }
});


// =====================
// Login
// =====================
router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/login", async (req, res) => {
  try {
    const result = await authService.login(req.body);

    res.cookie("token", result.token, {
      httpOnly: true,
      secure: false,
      maxAge: 8 * 60 * 60 * 1000
    });

    return res.redirect("/dashboard?success=Login successful");

  } catch (err) {
    return res.redirect(`/login?error=${encodeURIComponent(err.message)}`);
  }
});


// =====================
// Billing
// =====================
router.get("/billing", verifyViewToken, (req, res) => {
  res.render("billing", {
    user: req.user,
    activePage: "billing"
  });
});


// =====================
// Sales (Owner Only)
// =====================
router.get("/sales", verifyViewToken, (req, res) => {
  if (req.user.role !== "Owner") {
    return res.redirect("/dashboard?error=Access denied");
  }

  res.render("sales", { user: req.user });
});


// =====================
// Inventory (Owner & Pharmacist)
// =====================
// =====================
// Inventory (Owner & Pharmacist)
// =====================
router.get("/inventory", verifyViewToken, (req, res) => {
  if (req.user.role === "Staff") {
    return res.redirect("/dashboard?error=Access denied");
  }

  res.render("inventory", {
    user: req.user,
    activePage: "inventory"
  });
});


// =====================
// Stock Movements (Owner & Pharmacist)
// =====================
router.get("/inventory/movements/:medicineId", verifyViewToken, (req, res) => {
  if (req.user.role === "Staff") {
    return res.redirect("/dashboard?error=Access denied");
  }

  res.render("inventory-movements", {
    user: req.user,
    medicineId: req.params.medicineId,
    activePage: "inventory"
  });
});


// =====================
// Restock Medicine (Owner Only)
// =====================
router.get("/inventory/restock/:medicineId", verifyViewToken, (req, res) => {

  if (req.user.role === "Staff") {
    return res.redirect("/dashboard?error=Access denied");
  }

  res.render("restock", {
    user: req.user,
    medicineId: req.params.medicineId,
    activePage: "inventory"
  });
});


// =====================
// Adjust Stock (Owner Only)
// =====================
router.get("/inventory/adjust/:batchId", verifyViewToken, (req, res) => {

  if (req.user.role !== "Owner") {
    return res.redirect("/dashboard?error=Access denied");
  }

  res.render("adjust-stock", {
    user: req.user,
    batchId: req.params.batchId,
    activePage: "inventory"
  });
});


// =====================
// Add Medicine (Owner Only)
// =====================
router.get("/add-medicine", verifyViewToken, (req, res) => {
  if (req.user.role === "Staff") {
    return res.redirect("/dashboard?error=Access denied");
  }

  res.render("addMedicine", {
    user: req.user,
    activePage: "inventory"
  });
});
// =====================
// Orders (Owner & Pharmacist)
// =====================
router.get("/orders", verifyViewToken, (req, res) => {

  if (req.user.role === "Staff") {
    return res.redirect("/dashboard?error=Access denied");
  }

  res.render("orders", {
    user: req.user,
    activePage: "orders"
  });

});
router.get("/suppliers", verifyViewToken, (req, res) => {

  if (req.user.role === "Staff") {
    return res.redirect("/dashboard?error=Access denied");
  }

  res.render("suppliers", {
    user: req.user,
    activePage: "suppliers"
  });

});
router.get("/profile", verifyViewToken, (req, res) => {

  res.render("profile", {
    user: req.user,
    activePage: "profile"
  });

});
router.get("/users", verifyViewToken, (req, res) => {

if(req.user.role !== "Owner"){
return res.redirect("/dashboard?error=Access denied");
}

res.render("users",{
user:req.user,
activePage:"users"
});

});
// =====================
// Analysis (Owner & Pharmacist)
// =====================
router.get("/analysis", verifyViewToken, (req, res) => {

  if (req.user.role === "Staff") {
    return res.redirect("/dashboard?error=Access denied");
  }

  res.render("analysis", {
    user: req.user,
    activePage: "analysis"
  });

});


// =====================
// Medicine Analysis Detail
// =====================
router.get("/analysis/medicine/:id", verifyViewToken, (req, res) => {

  if (req.user.role === "Staff") {
    return res.redirect("/dashboard?error=Access denied");
  }

  const medicineId = parseInt(req.params.id);

  if (!medicineId) {
    return res.redirect("/analysis?error=Invalid medicine");
  }

  res.render("analysis-detail", {
    user: req.user,
    activePage: "analysis",
    medicineId
  });

});

// =====================
// Notifications (Owner & Pharmacist)
// =====================
router.get("/notifications", verifyViewToken, (req, res) => {

  // restrict staff (same pattern as analysis/inventory)
  if (req.user.role === "Staff") {
    return res.redirect("/dashboard?error=Access denied");
  }

  res.render("notifications", {
    user: req.user,
    activePage: "notifications"
  });

});
// =====================
// Logout
// =====================
router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/login?success=Logged out successfully");
});

module.exports = router;