pragma circom 2.1.9;

include "../register_id.circom";

component main { public [ merkle_root ] } = REGISTER_ID(256, 256, 46, 120, 35, 512, 128);