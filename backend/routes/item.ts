import express from "express";
import Item from "../models/Item";
import { verifyJWT } from "../middleware/auth";
import { z } from "zod";

const router = express.Router();

// Zod schemas (server-side validation)
const createSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
});

const updateSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
});

/**
 * Create Item (protected)
 */
router.post("/", verifyJWT, async (req: any, res) => {
  try {
    const parsed = createSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: "Invalid input", errors: parsed.error.issues });

    const item = await Item.create({ ...parsed.data, owner: req.user.id });
    return res.status(201).json({ item });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

/**
 * List items with pagination + search
 * query: ?page=1&limit=10&q=searchText
 * If user wants only their items: ?mine=true
 * Admin can fetch all items
 */
router.get("/", verifyJWT, async (req: any, res) => {
  try {
    const page = Math.max(1, parseInt(String(req.query.page || "1")));
    const limit = Math.max(1, Math.min(100, parseInt(String(req.query.limit || "10"))));
    const q = String(req.query.q || "").trim();
    const mine = req.query.mine === "true";

    const filter: any = {};
    if (q) filter.title = { $regex: q, $options: "i" };
    if (mine) filter.owner = req.user.id;

    // if user is not admin and not requesting mine explicitly, restrict to owner
    if (req.user.role !== "admin" && !mine) {
      filter.owner = req.user.id;
    }

    const total = await Item.countDocuments(filter);
    const items = await Item.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("owner", "name email");

    return res.json({ items, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

/**
 * Get single item (protected) - accessible if owner or admin
 */
router.get("/:id", verifyJWT, async (req: any, res) => {
  try {
    const item = await Item.findById(req.params.id).populate("owner", "name email");
    if (!item) return res.status(404).json({ message: "Not found" });

    if (req.user.role !== "admin" && item.owner._id.toString() !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }
    return res.json({ item });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

/**
 * Update item (owner or admin)
 */
router.put("/:id", verifyJWT, async (req: any, res) => {
  try {
    const parsed = updateSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: "Invalid input"});

    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Not found" });

    if (req.user.role !== "admin" && item.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    Object.assign(item, parsed.data);
    await item.save();
    return res.json({ item });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

/**
 * Delete item (owner or admin)
 */
router.delete("/:id", verifyJWT, async (req: any, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Not found" });

    if (req.user.role !== "admin" && item.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await item.deleteOne();
    return res.json({ message: "Deleted" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;
