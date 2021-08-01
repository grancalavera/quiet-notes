export const Notebook = () => {
  return <h1>Notebook</h1>;
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
