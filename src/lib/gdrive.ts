const FILE_NAME = 'dashboard-backup.json';

// Helper to interact with Google Drive API
export async function syncToDrive(token: string, data: any) {
  try {
    // 1. Search if the file already exists
    const searchRes = await fetch(
      `https://www.googleapis.com/drive/v3/files?q=name='${FILE_NAME}' and trashed=false`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    const searchData = await searchRes.json();
    if (searchData.error) throw new Error(searchData.error.message);

    const fileContent = JSON.stringify(data);
    const metadata = {
      name: FILE_NAME,
      mimeType: 'application/json'
    };

    if (searchData.files && searchData.files.length > 0) {
      // 2a. File exists, update it
      const fileId = searchData.files[0].id;
      
      const res = await fetch(`https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=media`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: fileContent
      });

      if (!res.ok) throw new Error('Failed to update existing backup');
      return await res.json();
    } else {
      // 2b. File does not exist, create it (metadata only)
      const createRes = await fetch('https://www.googleapis.com/drive/v3/files', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(metadata)
      });
      
      if (!createRes.ok) throw new Error('Failed to create new backup file metadata');
      const newFile = await createRes.json();
      
      // Then upload the content to the newly created file
      const uploadRes = await fetch(`https://www.googleapis.com/upload/drive/v3/files/${newFile.id}?uploadType=media`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: fileContent
      });
      
      if (!uploadRes.ok) throw new Error('Failed to upload content to new backup file');
      return await uploadRes.json();
    }
  } catch (err: any) {
    console.error('Google Drive Sync Error:', err);
    throw err;
  }
}

export async function hydrateFromDrive(token: string) {
  try {
      // 1. Search for the file
      const searchRes = await fetch(
        `https://www.googleapis.com/drive/v3/files?q=name='${FILE_NAME}' and trashed=false`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
  
      const searchData = await searchRes.json();
      if (searchData.error) throw new Error(searchData.error.message);
  
      if (searchData.files && searchData.files.length > 0) {
        const fileId = searchData.files[0].id;
        
        // 2. Download the content
        const dlRes = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (!dlRes.ok) throw new Error('Failed to download backup file');
        const data = await dlRes.json();
        return data;
      }
      
      return null; // No file found
  } catch (err: any) {
    console.error('Google Drive Download Error:', err);
    throw err;
  }
}
