const bcrypt = require('bcrypt');

bcrypt.hash('admin', 10).then(hash => {
  console.log("$2b$10$KiGAYnYlQsba7lnKf.6Wye5H7gPTNroTU4qloN9tqiH1MJ7VKglzK", hash);
});
