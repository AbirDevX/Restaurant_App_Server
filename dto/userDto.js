class UserDto {
  _id;
  name;
  email;
  mobile;
  avatar;
  role;
  address;
  createdAt;
  updatedAt;

  constructor(user) {
    this._id = user._id;
    this.mobile = user.mobile;
    this.avatar = user.avatar;
    this.name = user.name;
    this.role = user.role;
    this.email = user.email;
    this.address = user.address;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }
}

module.exports = { UserDto };
