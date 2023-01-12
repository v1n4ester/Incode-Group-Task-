const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  isBoss: {
    type: Boolean,
    required: true,
  },
  token: {
    type: String,
    required: true
  },
  subordinates: {
    users: [
      {
        name: {
          type: String,
          required: true,
        },
        userId: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        position: {
          type: String,
          required: true,
        },
      },
    ],
  },
  avatarUrl: String,
});

userSchema.methods.changeRole = async function (id) {
  try {
    let employees = [...this.subordinates.users];
    const candidate = employees.filter(
      (c) => c.userId.toString() === id.toString()
    );
    if (candidate) {
      const editedEmployees = employees
      .filter(u => u.userId.toString() !== candidate[0].userId.toString())
      editedEmployees.push({
          name: this.name,
          userId: this._id,
          position: candidate[0].position,
        });
      this.isBoss = false;
      this.subordinates.users = [];
        return [this.save(), editedEmployees]
    }
  } catch (e) {
    return "unaccess";
  }
};

userSchema.methods.becameBoss = async function (arr) {
      this.isBoss = true
      this.subordinates.users = arr 
      return this.save()
  };

userSchema.methods.addSubordinate = function(candidate, position) {
    const users = [...this.subordinates.users]
    const idx = users.findIndex(u => {
        return u.userId.toString() === candidate._id.toString()
    })
    if(idx >= 0) {
        return "The user is already hired"
    }else {
        users.push({
            name: candidate.name,
            userId: candidate._id,
            position
        })
    }

    this.subordinates = {users}
    return this.save()
    
}

module.exports = model("User", userSchema);
