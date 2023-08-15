
/* * Copyright (c) 2023 MundoGIS
 *
 * This file is licensed under the GNU General Public License (GPL) version 3.
 * You can obtain a copy of the license at https://www.gnu.org/licenses/gpl-3.0.html#license-text. */

module.exports = function(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect('./qgs');
  };
  