const { Router } = require("express");
const User = require("../models/user");
const auth = require("../middlewares/auth");

const router = Router();

router.get("/", auth, async (req, res) => {
  try {
    const { token } = req.body;

    const candidate = await User.findOne({ token });

    if (candidate) {
      if (candidate.isAdmin) {
        const users = await User.find();
        const list = users.map((u) => {
          return {
            name: u.name,
            email: u.email,
            isAdmin: u.isAdmin,
            isBoss: u.isBoss,
            subordinates: u.subordinates,
          };
        });
        return res.status(200).json({
          list,
        });
      } else if (candidate.isBoss) {
        return res.status(200).json({
          users: [
            {
              name: candidate.name,
              email: candidate.email,
            },
            ...candidate.subordinates.users,
          ],
        });
      } else {
        return res.status(200).json({
          users: {
            name: candidate.name,
            email: candidate.email,
          },
        });
      }
    }
  } catch (e) {
    res.status(500);
  }
});

router.post("/edit", auth, async (req, res) => {
  try {
    const { token, email } = req.body;

    const user = await User.findOne({ token });

    if (user) {
      if (user.isBoss) {
        const candidate = await User.findOne({ email });
        if (candidate) {
          const id = candidate._id;
          const result = await user.changeRole(id);
          await candidate.becameBoss(result[1])
          if (result == "unaccess") {
            return res.status(500);
          } else {
            const resultUser = await result[0]
            return res.status(200).json({ 
                email: resultUser.email,
                name: resultUser.name,
                isBoss: resultUser.isBoss,
                token: resultUser.token
              });
          }
        }else{
            return res.status(500)
        }
      } else {
        return res.status(403);
      }
    } else {
      return res.status(401);
    }
  } catch (e) {
    return res.status(500);
  }
});

router.post("/add", auth, async (req, res) => {
    try {
      const { token, email, position } = req.body;
  
      const user = await User.findOne({ token });
  
      if (user) {
        if (user.isBoss) {
          const candidate = await User.findOne({ email });
          if (candidate) {
            const result = await user.addSubordinate(candidate, position);
            if (result == "The user is already hired") {
              return res.status(400).json({ result });
            } else {
              return res.status(200).json({ 
                email: result.email,
                name: result.name,
                isBoss: result.isBoss,
                token: result.token,
                subordinates: {
                    users: result.subordinates.users.map(u => ({name: u.name, position: u.position}))
                }
              });
            }
          }else{
              return res.status(500)
          }
        } else {
          return res.status(403);
        }
      } else {
        return res.status(401);
      }
    } catch (e) {
      return res.status(500);
    }
  });

module.exports = router;
