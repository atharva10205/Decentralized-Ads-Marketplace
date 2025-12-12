// src/lib/serverProgram.ts
import * as anchor from "@project-serum/anchor";
import { Keypair, Connection } from "@solana/web3.js";
import idl from "../idl/ad_escrow.json";
import { CLUSTER_URL, PROGRAM_ID } from "./solana";

export function getServerProgramFromEnv() {
  const json = process.env.ORACLE_KEYPAIR_JSON;
  if (!json) throw new Error("Missing ORACLE_KEYPAIR_JSON env var");
  const secret = Uint8Array.from(JSON.parse(json));
  const keypair = Keypair.fromSecretKey(secret);
  const connection = new Connection(CLUSTER_URL, "confirmed");
  const wallet = new anchor.Wallet(keypair);
  const provider = new anchor.AnchorProvider(connection, wallet, anchor.AnchorProvider.defaultOptions());
  anchor.setProvider(provider);
  const program = new anchor.Program(idl as any, new anchor.web3.PublicKey(PROGRAM_ID), provider);
  return { program, provider, keypair };
}
