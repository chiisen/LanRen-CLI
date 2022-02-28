INSERT INTO `game`.`game_default_currency_denom` (`Currency`,`Denom`) VALUES ('KBB',"13,12,11,10,9,8,7,6,5,4")
      ON DUPLICATE KEY UPDATE `Denom` = VALUES(`Denom`);