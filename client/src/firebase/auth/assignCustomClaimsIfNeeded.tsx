export default async function assignCustomClaimsIfNeeded(email: string, uid: string) {
       if (process.env.ADMIN_USERS) {
              const listOfAdminUsers = process.env.ADMIN_USERS.split(',');
              if (listOfAdminUsers.includes(email)) {
                     const claims = { admin: true };
                     await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/setCustomUserClaims`, {
                            method: 'POST',
                            headers: {
                                   'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ uid, claims })
                     });
              }
       }
}