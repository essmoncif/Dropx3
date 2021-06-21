import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express'
import { Express } from 'express'
import { IpfsService } from './ipfs.service';


@Controller('ipfs')
export class IpfsController {

    constructor(private readonly ipfsService: IpfsService){}

    @Post()
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(@UploadedFile() file: Express.Multer.File) {
        return await this.ipfsService.addFile(file.buffer)
    }

}
