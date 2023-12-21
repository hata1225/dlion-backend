import { User } from "@prisma/client"
import { UserRepository } from "../repositories/userRepository"
import { v4 as uuidv4 } from "uuid"
import { throwErrorIfFalsy } from "../utils/db"

export class UserService {
    private userRepository: UserRepository

    constructor() {
        this.userRepository = new UserRepository()
    }


    /**
     * ### ユーザーを取得
     * - userIdで取得
     */
    async getUserByUserId(userId: User["userId"]) {
        try{
            const user = await this.userRepository.get("user_id", userId)
            return user
        } catch (error) {
            throw error
        }
    }


    /**
     * ### ユーザーを取得
     * - accountNameで取得
     */
    async getUserByAccountName(accountName: User["accountName"]) {
        try{
            const user = await this.userRepository.get("account_name", accountName)
            return user
        } catch (error) {
            throw error
        }
    }


    /**
     * ### ユーザーを取得
     * - googleIdで取得
     */
    async getUserByGoogleId(googleId: User["googleId"]) {
        try{
            const user = await this.userRepository.get("google_id", googleId)
            return user
        } catch (error) {
            throw error
        }
    }


    /**
     * ### ユーザーを作成
     * - accountNameがない場合は20文字のランダムな文字列を生成
     * - 重複チェックあり
     * - googleIdがある場合はgoogleIdを保存
     */
    async createUser(email: User["email"], accountName: User["accountName"] | null, name: User["name"], googleId: User["googleId"] = null) {
        const connection = await this.userRepository.beginTransaction()
        try {
            const userId = uuidv4()
            if(!accountName) {
                accountName = await this.craeteRandomAccountName()
            }
            await this.userRepository.create(userId, email, accountName, name, googleId)
            await this.userRepository.commit(connection)
            const user = await this.getUserByUserId(userId)

            throwErrorIfFalsy(user, "@createUser: Failed to create user.")
            return user
        } catch (error) {
            await this.userRepository.rollback(connection)
            throw error
        }
    }


    /**
     * ### ユーザーを更新
     * - userIdで更新
     * - fieldsToUpdateで更新するフィールドを指定
    */
    async updateUserByUserId(userId: User["userId"], fieldsToUpdate: Partial<User>) {
        const connection = await this.userRepository.beginTransaction()
        try {
            if(fieldsToUpdate?.accountName) {
                const isExist = await this.userRepository.isExistAccountName(fieldsToUpdate.accountName)
                throwErrorIfFalsy(!isExist, "Account name already exists.")
            }
            await this.userRepository.update(userId, fieldsToUpdate)
            await this.userRepository.commit(connection)
            throwErrorIfFalsy(userId, "@updateUser: Failed to update user.")

            const user = await this.getUserByUserId(userId)
            return user
        } catch (error) {
            await this.userRepository.rollback(connection)
            throw error
        }
    }


    /**
     * ### ユーザーを削除
     * - userIdで削除
     */
    async deleteUserByUserId(userId: User["userId"]) {
        const connection = await this.userRepository.beginTransaction()
        try {
            await this.userRepository.delete(userId)
            await this.userRepository.commit(connection)
            return true
        } catch (error) {
            await this.userRepository.rollback(connection)
            throw error
        }
    }


    /**
     * ### 20文字のランダムなaccountNameを生成
     * - 重複チェックあり
     */
    async craeteRandomAccountName() {
        try {
            let accountName = await this.userRepository.createAccountNameBy20RandomBytes()

            const isExist = await this.userRepository.isExistAccountName(accountName)

            if(isExist) {
                accountName = await this.craeteRandomAccountName()
            }

            return accountName
        } catch (error) {
            throw error
        }
    }
}
