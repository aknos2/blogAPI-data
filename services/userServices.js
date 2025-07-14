import prisma from "../lib/prisma.js";

export async function findUsername(username) {
  return await prisma.user.findUnique({
    where: { username },
  });
}

export async function findUserById(id) {
  return await prisma.user.findUnique({
    where: { id },
  });
}

export async function createUser(username, password) {
  return await prisma.user.create({
    data: {username, password},
  })
}
