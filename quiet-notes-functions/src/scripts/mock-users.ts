import * as admin from "firebase-admin";

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});

const createMockUsers = async (): Promise<void> => {
  Promise.all([...Array(100)].map((_, i) => createMockUser(mockEmail(i))));
};

const deleteMockUsers = async (): Promise<void> => {
  const uids = await Promise.all(
    [...Array(100)].map((_, i) => getMockUserUid(mockEmail(i)))
  );
  admin.auth().deleteUsers(uids);
};

const createMockUser = async (email: string): Promise<void> => {
  try {
    const userRecord = await admin.auth().createUser({ email });
    console.log("Successfully created new user:", userRecord.uid);
  } catch (e) {
    console.error("failed to create mock user");
    console.error(e);
  }
};

const getMockUserUid = async (email: string): Promise<string> => {
  const { uid } = await admin.auth().getUserByEmail(email);
  return uid;
};

const mockEmail = (i: number) => `mock-user-${i}@quiet.works`;

const command = process.argv[2];

if (command === "--create") {
  createMockUsers();
} else if (command === "--delete") {
  deleteMockUsers();
} else {
  console.log(`yarn mock-users:
--create: creates 100 mock users
--delete: deletes 100 mock users
`);
}
