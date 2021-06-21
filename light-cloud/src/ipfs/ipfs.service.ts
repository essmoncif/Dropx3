import { Injectable } from '@nestjs/common';
import { create }  from 'ipfs-http-client';


@Injectable()
export class IpfsService {

    private client: ReturnType<typeof create>;

    public constructor(){
        this.client = create({
            port: parseInt(process.env.IPFS_PORT),
            host: process.env.IPFS_HOST,
            protocol: process.env.IPFS_PROTOCOL
        })
    }

    async addFile(data: Buffer){
        try {
            const { cid } = await this.client.add(data)
            return cid.toString()
        } catch (error) {
            console.log('Error')
        }
    }

    async getFile(cid: string){
        const chunks = []
        for await (const chunk of this.client.cat(cid)) {
            chunks.push(chunk)
        }
        return Buffer.concat(chunks)
    }

}
