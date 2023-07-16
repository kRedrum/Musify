# My Database Schema

album multiple folders for different versions for same album like (deluxed/standard/remasters)

```mermaid
erDiagram
    ARTIST {
        uuid id PK %% index
        string name %% index
        date born
        string banner
        string description
        string area
        string type
    }

    ALBUM {
        uuid id PK %% index
        string cover
        number length
        string format
        string language
        string released_at
        string type %% type EP/Album
        string name %% index
    }

    USER_POLICIES {
      uuid user_id
      uuid policy_id
    }

    TAGS {
        uuid id PK
        string name %% Which should be PK (id or name or joint)?
        string description
    }

    TRACK {
        uuid id PK %% index
        string name
        number length
        string filepath
        number num
        string format
        string isrc
        string size
        string bitrate
        string recorded_at
        number inode
    }

    USER {
        uuid id PK
        string name
        date last_login
        date last_activity
        string password
    }

    USER_POLICY {
      uuid policy_id FK
      uuid user_id FK
    }

    POLICY {
        uuid id PK
        string name
        string description
    }

    COLLECTION {
        uuid id PK
        string name
        uuid user_id FK
    }

    COLLECTION_SONG {
        uuid collection_id FK
        uuid track_id FK
    }

