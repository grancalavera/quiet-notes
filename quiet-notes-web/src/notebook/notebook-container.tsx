import { useAppState } from "../app/app-state";

export const Notebook = () => {
  const getUser = useAppState((s) => s.getUser);
  return <h1>Notebook: {getUser().displayName}</h1>;
};

// export const Notebook = () => {
//   const [user] = useAuthState();
//   const closeNote = useNotebookState((s) => s.closeNote);
//   useEffect(() => {
//     !user && closeNote();
//   }, [user, closeNote]);

//   return user ? (
//     <AppLayout
//       header={<Header />}
//       sidebarToolbar={<SidebarToolbar />}
//       sidebar={<NotesList />}
//       editorToolbar={<EditorToolbar />}
//       editor={<NoteEditorContainer />}
//     />
//   ) : (
//     <CenterLayout>
//       <Button large onClick={signIn}>
//         Sign In with Google
//       </Button>
//     </CenterLayout>
//   );
// };
