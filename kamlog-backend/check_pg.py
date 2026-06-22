import socket

def check_postgres():
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.settimeout(2)
    try:
        s.connect(('127.0.0.1', 5432))
        print("PostgreSQL is reachable on localhost:5432")
        return True
    except socket.error as e:
        print(f"PostgreSQL not reachable: {e}")
        return False
    finally:
        s.close()

if __name__ == "__main__":
    check_postgres()
