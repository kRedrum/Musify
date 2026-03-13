# My Database Schema

```mermaid
erDiagram
    ARTIST {
        uuid id PK
        string name
        date born
        string area
        string type
        string tags
    }

    ALBUM {
        uuid id PK
        string name
        number nrOfSongs
        uuid artist_id FK
    }

    SONG {
        uuid id PK
        string name
        string sector
        uuid track_id FK
        uuid artist_id FK
        uuid album_id FK
    }

    %% Physical Storage Layer
    FOLDER {
        uuid id PK
        string path
        number size
        uuid parent_folder_id FK
    }

    TRACK {
        uuid id PK
        uuid song_id FK
        uuid folder_id FK
        string filename
        string extension
        number inode
    }

    %% User & Permissions Layer
    USER {
        uuid id PK
        string name
        date last_login
        date last_activity
        string password
    }

    POLICY {
        uuid id PK
        string name
        string description
    }

    USER_POLICY {
        uuid user_id FK
        uuid policy_id FK
    }

    COLLECTION {
        uuid id PK
        string name
        uuid user_id FK
    }

    COLLECTION_SONG {
        uuid collection_id FK
        uuid song_id FK
    }

    %% Relationships
    ARTIST ||--o{ SONG : creates
    ALBUM ||--o{ SONG : contains
    SONG ||--|| TRACK : has_file
    FOLDER ||--o{ TRACK : holds
    FOLDER ||--o{ FOLDER : "contains (parent_folder)"

    USER ||--o{ COLLECTION : owns
    COLLECTION ||--o{ COLLECTION_SONG : contains
    SONG ||--o{ COLLECTION_SONG : included_in

    USER ||--o{ USER_POLICY : has
    POLICY ||--o{ USER_POLICY : assigned_to
